import VideoForm from "@/components/forms/VideoForm";

export const metadata = {
  title: "Upload Video | CMS",
};

export default function UploadVideoPage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Upload a New Video</h1>
      <VideoForm />
    </div>
  );
}
