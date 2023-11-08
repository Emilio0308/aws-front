const Loading = () => {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-5xl w-full mx-auto min-h-screen">
      <div className="w-full bg-gray-400 animate-pulse my-5 h-[40px]"></div>
      <section className="w-full min-h-[550px] rounded-lg bg-gray-400 animate-pulse relative mb-20">
        <div className="h-[240px] w-[320px] bg-gray-700 rounded-lg delay-30000 absolute right-0 bottom-0 translate-y-[50%]"></div>
      </section>

      <section className="grid grid-cols-[1fr,_auto] gap-5 pt-20">
        <div className="bg-gray-400 animate-pulse min-h-[450px] "></div>
        <div className="bg-gray-400 animate-pulse min-h-[450px] w-44 "></div>
      </section>
      
    </div>
  );
};
export default Loading;
