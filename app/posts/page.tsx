import Posts from "./components/Posts";

import FriendsCard from "@/components/FriendsCard";
import FriendshipsCard from "@/components/FriendshipsCard";
import NavBar from "@/components/NavBar";
import StoriesCard from "@/components/StoriesCard";

function Home() {
  return (
    <div className="w-full h-screen bg-gray-[#f5f5f5] ">
      <section className="flex justify-between gap-6 p-6 px-8 max-sm:px-1">
        <article className=" flex-grow max-w-sm w-full bg-white h-[82vh] shrink dark:bg-black  dark:text-white flex flex-col  items-start gap-5  pb-4 max-xl:hidden">
          <StoriesCard />
          <FriendshipsCard />
        </article>
        <article className="m-auto flex-grow max-w-2xl w-full bg-white rounded-md h-[82vh] max-lg:max-w-full max-xl:shrink-0  dark:bg-black  dark:text-white flex-col">
          <Posts />
        </article>
        <article className="flex-grow max-w-sm w-full bg-white h-[82vh] shrink dark:bg-black  dark:text-white flex flex-col items-end gap-5 pb-4 max-xl:hidden">
          <FriendsCard />
        </article>
      </section>

      <NavBar />
    </div>
  );
}

export default Home;
