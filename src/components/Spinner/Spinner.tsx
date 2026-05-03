const Spinner = ({ size = 28, white }: { size?: number; white?: boolean }) => (
  <div
    className={`rounded-full animate-spin shrink-0 ${
      white
        ? "border-[2.5px] border-white/30 border-t-white"
        : "border-[2.5px] border-gray-200 border-t-primary"
    }`}
    style={{ width: size, height: size }}
  />
);

export const PageSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <Spinner />
  </div>
);

export default Spinner;
