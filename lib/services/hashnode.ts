import type {
  HashnodePost,
  HashnodePostDetail,
  HashnodePageInfo,
} from "./types";

const GQL_ENDPOINT = "https://gql.hashnode.com";

const HOST = process.env.HASHNODE_PUBLICATION_HOST!;

async function gql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error(`Hashnode request failed: ${res.status}`);
  }

  const json = (await res.json()) as { data: T; errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// ─── Types matching Hashnode GraphQL responses ────────────────────────────────

interface RawPost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  coverImage: { url: string } | null;
  publishedAt: string;
  readTimeInMinutes: number;
  tags: Array<{ name: string; slug: string }>;
}

interface RawPostDetail extends RawPost {
  content: { html: string };
}

interface PostsQueryResponse {
  publication: {
    posts: {
      edges: Array<{ node: RawPost }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
}

interface PostQueryResponse {
  publication: {
    post: RawPostDetail | null;
  };
}

interface SlugsQueryResponse {
  publication: {
    posts: {
      edges: Array<{ node: { slug: string } }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapPost(raw: RawPost): HashnodePost {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    brief: raw.brief,
    cover_image_url: raw.coverImage?.url ?? null,
    published_at: raw.publishedAt,
    read_time_minutes: raw.readTimeInMinutes,
    tags: raw.tags,
  };
}

function mapPostDetail(raw: RawPostDetail): HashnodePostDetail {
  return {
    ...mapPost(raw),
    content_html: raw.content.html,
  };
}

// ─── Public methods ───────────────────────────────────────────────────────────

export async function getPosts(options: {
  first?: number;
  after?: string;
} = {}): Promise<{ posts: HashnodePost[]; page_info: HashnodePageInfo }> {
  const data = await gql<PostsQueryResponse>(
    `
    query GetPublicationPosts($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        posts(first: $first, after: $after) {
          edges {
            node {
              id title slug brief
              coverImage { url }
              publishedAt readTimeInMinutes
              tags { name slug }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
    `,
    { host: HOST, first: options.first ?? 20, after: options.after ?? null }
  );

  return {
    posts: data.publication.posts.edges.map((e) => mapPost(e.node)),
    page_info: {
      has_next_page: data.publication.posts.pageInfo.hasNextPage,
      end_cursor: data.publication.posts.pageInfo.endCursor,
    },
  };
}

export async function getPostBySlug(
  slug: string
): Promise<HashnodePostDetail | null> {
  const data = await gql<PostQueryResponse>(
    `
    query GetPost($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id title slug brief
          coverImage { url }
          publishedAt readTimeInMinutes
          tags { name slug }
          content { html }
        }
      }
    }
    `,
    { host: HOST, slug }
  );

  const post = data.publication.post;
  return post ? mapPostDetail(post) : null;
}

export async function getAllPostSlugs(): Promise<Array<{ slug: string }>> {
  const slugs: string[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const data: SlugsQueryResponse = await gql<SlugsQueryResponse>(
      `
      query GetAllSlugs($host: String!, $first: Int!, $after: String) {
        publication(host: $host) {
          posts(first: $first, after: $after) {
            edges { node { slug } }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
      `,
      { host: HOST, first: 50, after: cursor }
    );

    for (const edge of data.publication.posts.edges) {
      slugs.push(edge.node.slug);
    }

    hasMore = data.publication.posts.pageInfo.hasNextPage;
    cursor = data.publication.posts.pageInfo.endCursor;
  }

  return slugs.map((slug) => ({ slug }));
}
