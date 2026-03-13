export default async function CanvasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="h-screen w-full">
      <p className="p-8 text-gray-600">Canvas {id} — loading...</p>
    </div>
  );
}
