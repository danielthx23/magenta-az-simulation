import Image from "next/image";
import Link from "next/link";
import { getBlobUrl } from "../services/azurestorage/azurestorage.service";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen rounded-md font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-[700px] min-h-[600px] bg-[#e3017e] text-white flex flex-col p-16 gap-1 rounded-lg justify-center items-center">
      <figure>
        <Image width={200} height={200} src={getBlobUrl("https://storageaccmagenta01.blob.core.windows.net/magentapplication/staticimages/dl-telekom-logo-01.jpg")} alt={"Logo T-systems"} />
      </figure>
      <article className="flex flex-col gap-12 justify-center items-center">
      <h1 className="text-2xl font-black text-center">Bem vindo ao T-Academy Grupo Magenta Quiz!</h1>
      <Link href="/register" className="px-4 py-2 bg-white w-fit rounded-md text-[#e3017e] text-xl hover:text-white hover:bg-[#e3017e] border-2 hover:border-white 
        transition-all ease-in-out">Jogue o nosso Quiz!</Link>
      </article>
      </main>
    </div>
  );
}
