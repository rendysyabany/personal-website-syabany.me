import React from "react";
import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "@/components/getPostMetadata"
import { format } from "date-fns";

const getPostContent = (slug: string) => {
  const folder = "content/posts/";
  const file = `${folder}${slug}.md`;

  try {
    const content = fs.readFileSync(file, "utf8");
    const matterResult = matter(content);
    return matterResult;
  } catch (error) {
    // console.error("Error reading post content:", error);
    return null;
  }
};

export const generateStaticParams = async () => {
	const posts = getPostMetadata()
	return posts.map((post: { slug: any; }) => ({
		slug: post.slug,
	}))
}


const PostPage = (props: any) => {
  const { slug } = props.params;
  const post = getPostContent(slug);

  if (!post) {
    return <div>Content not found.</div>;
  }

  const {
    data: { title, shortDescription, datePublished },
    content,
  } = post;

  const h1Style = "text-2xl sm:text-4xl font-bold mb-4 text-gray-700";
  const h2Style = "text-xl sm:text-3xl font-semibold mb-3 text-gray-700";
  const h3Style = "text-lg sm:text-2xl font-semibold mb-3 text-gray-700";
  const pStyle =
    "text-md sm:text-lg mt-[-2px] font-serif font-normal leading-relaxed tracking-normal text-gray-700";
  const quoteStyle =
    "text-xl sm:text-2xl mt-[-2px] font-serif font-normal leading-normal tracking-normal text-gray-700 pl-4 border-l-2 border-gray-400 italic";

  return (
    <div className="mx-5 flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <div className="inline-flex flex-col items-start justify-start gap-4">
          <p className="text-sm mb-2 font-serif font-normal leading-normal tracking-normal text-gray-500">
          Published on {format(new Date(datePublished), 'dd MMMM yyyy')}
          </p>
          <p className="font-sans text-xl sm:text-3xl font-semibold leading-7 sm:leading-9 tracking-normal text-gray-700">
            {title}
          </p>
          <p className="text-md font-serif font-normal leading-normal tracking-normal text-gray-500">
            {shortDescription}
          </p>
        </div>
      </div>

      <div className="my-4 border-t border-gray-300"></div>

      <article className="prose prose-quoteless prose-neutral md:prose-lg dark:prose-invert prose-h2:font-kasei dark:prose-a:text-neutral-500 pb-8">
        <Markdown
          className="flex flex-col gap-7"
          options={{
            overrides: {
              h1: { component: "h1", props: { className: h1Style } },
              h2: { component: "h2", props: { className: h2Style } },
              h3: { component: "h3", props: { className: h3Style } },
              p: { component: "p", props: { className: pStyle } },
              blockquote: {
                component: "blockquote",
                props: { className: quoteStyle },
              },
            },
          }}
        >
          {content}
        </Markdown>
      </article>
    </div>
  );
};

export default PostPage;
