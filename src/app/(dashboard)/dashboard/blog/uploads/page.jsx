import BlogForm from "@/components/forms/BlogForm";

export const metadata = {
  title: "Upload Blog | CMS",
};

export default function UploadBlogPage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Upload a New Blog</h1>
      <BlogForm />
    </div>
  );
}
