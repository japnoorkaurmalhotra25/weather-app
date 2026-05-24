export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white mt-3">Fetching weather data...</p>
    </div>
  );
}