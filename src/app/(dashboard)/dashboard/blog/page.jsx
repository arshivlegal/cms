import BlogList from "@/components/lists/BlogList";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Blogs | CMS",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-s24">
      <div className="flex justify-between items-center">
        <h1 className="page-title-h2">All Blogs</h1>
        <Button as="link" href="/dashboard/blog/uploads" variant="primary">
          + Add New Blog
        </Button>
      </div>
      <BlogList />
    </div>
  );
}
