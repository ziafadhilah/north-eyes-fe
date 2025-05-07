const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4 text-lg">
        The page you are looking for does not exist.
      </p>
      <p className="mt-4 text-lg">
        <a href="/login" className="text-blue-500 hover:underline">
          Go back to Login
        </a>
      </p>
    </div>
  );
};

export default NotFound;
export const metadata = {
  title: "404 - Not Found",
  description: "The page you are looking for does not exist.",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";
