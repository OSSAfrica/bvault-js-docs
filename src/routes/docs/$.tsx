import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from 'fumadocs-ui/layouts/docs/page';
import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';
import { pageHead } from '@/lib/shared';
import { useMDXComponents } from '@/components/mdx';

export const Route = createFileRoute('/docs/$')({
  loader: ({ params }) => {
    const page = source.getPage(params._splat?.split('/').filter(Boolean));
    if (!page) throw notFound();
    return { slugs: page.slugs };
  },
  head: ({ loaderData }) => {
    const page = loaderData && source.getPage(loaderData.slugs);
    return page ? pageHead(page.data.title, page.data.description ?? '', page.url) : {};
  },
  component: Page,
});

function Page() {
  const { slugs } = Route.useLoaderData();
  const page = source.getPage(slugs)!;
  const MDX = page.data.body;
  return (
    <DocsLayout {...baseOptions()} tree={source.getPageTree()}>
      <DocsPage toc={page.data.toc}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
        <EditOnGitHub
          href={`https://github.com/OSSAfrica/bvault-js-docs/edit/main/content/docs/${page.path}`}
        />
      </DocsPage>
    </DocsLayout>
  );
}
