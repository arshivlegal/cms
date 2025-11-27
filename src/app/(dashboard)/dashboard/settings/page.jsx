export const metadata = {
  title: "Settings | CMS",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-s16">
      <h1 className="page-title-h2">Account Settings</h1>
      <p className="body-default text-secondary">
        Configure your profile and application preferences here.
      </p>
    </div>
  );
}
