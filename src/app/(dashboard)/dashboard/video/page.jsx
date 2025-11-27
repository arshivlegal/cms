import VideoList from "@/components/lists/VideoList";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Videos | CMS",
};

export default function VideoPage() {
  return (
    <div className="flex flex-col gap-s24">
      <div className="flex justify-between items-center">
        <h1 className="page-title-h2">All Videos</h1>
        <Button as="link" href="/dashboard/video/uploads" variant="primary">
          + Add New Video
        </Button>
      </div>
      <VideoList />
    </div>
  );
}
