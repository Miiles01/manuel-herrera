import { memo } from "react";

export const MobileShowreel = memo(({ content }: { content: any }) => {
  return (
    <section 
      className="sm:hidden w-full relative z-10 flex flex-col items-center justify-center px-6 py-20 min-h-[90vh] overflow-hidden rounded-b-[40px]"
      style={{ background: "linear-gradient(to bottom, #F8F9FD, #FDFDFD)" }}
    >
      <div className="relative z-10 w-full flex flex-col items-start h-full">
        <h2 className="text-[14vw] leading-[1.0] tracking-[-0.03em] font-normal text-[#08060c] mb-12">
          {content.hero.lines.map((line: string, i: number) => (
            <div key={i} className={i === 1 ? "text-gray-400" : ""}>
              {line}
            </div>
          ))}
        </h2>
        
        <div className="w-full aspect-[4/5] relative rounded-[20px] overflow-hidden bg-gray-200 mb-16 flex-shrink-0 mx-auto max-w-[85%] shadow-sm">
          <img 
            src="/assets/showreel/1.png" 
            alt="Manuel Herrera" 
            className="absolute inset-0 w-full h-full object-cover object-center "
          />
        </div>

        <p className="text-[4vw] font-medium leading-[1.4] text-gray-700 max-w-[85%] mt-auto mb-16">
          {content.hero.bottomBlock?.leftText}
        </p>

        <div className="w-full flex justify-end">
          <span className="text-[3.2vw] font-medium text-gray-500">
            {content.hero.bottomBlock?.rightText}
          </span>
        </div>
      </div>
    </section>
  );
});
MobileShowreel.displayName = "MobileShowreel";
