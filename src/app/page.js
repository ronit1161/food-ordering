import Hero from "@/components/layout/Hero";
import { HomeMenu } from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />

      <section className="text-center my-16">
        <SectionHeaders mainHeader={"Our story"} subHeader={"About us"} />
        <div className="max-w-2xl mx-auto mt-4 text-gray-500 flex flex-col gap-2">
          <p>
            lorem kwededb wekj fjw fjg jkgkgask jgdkg kjgefjg kjhwk sch k
            fhkjhskffh soid howi ihfosdhljas fkkj;a f;j;fj ;fj;kskajfkflh kvskjg
            o g fsiuda siudgaiwugf sud gasjvcakjhfgk dfiagd
          </p>
          <p>
            lorem kwededb wekj fjw fjg jkgkgask jgdkg kjgefjg kjhwk sch k
            fhkjhskffh soid howi ihfosdhljas fkkj;a f;j;fj ;fj;kskajfkflh kvskjg
            o g fsiuda siudgaiwugf sud gasjvcakjhfgk dfiagd lorem kwededb wekj
            fjw fjg jkgkgask jgdkg kjgefjg kjhwk sch k fhkjhskffh soid howi
            ihfosdhljas fkkj;a f;j;fj ;fj;kskajfkflh kvskjg o g fsiuda
            siudgaiwugf sud gasjvcakjhfgk dfiagd
          </p>
        </div>
      </section>

      <section className="text-center my-16">
        <SectionHeaders
          subHeader={"Don't hesitate"}
          mainHeader={"Contact Us "}
        />

        <div className="mt-8">
          <a className="text-4xl text-gray-500" href="tel:9879847545">
            +91 98798 47545
          </a>
        </div>
      </section>

    </>
  );
}
