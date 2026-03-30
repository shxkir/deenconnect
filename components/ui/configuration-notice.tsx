export function ConfigurationNotice() {
  return (
    <div className="rounded-[2rem] border border-amber-300 bg-amber-50 p-6 text-sm text-amber-950">
      Firebase environment variables are missing. Add the values from
      `.env.example`, restart the app, and this interface will connect to your
      live Firebase project.
    </div>
  );
}

