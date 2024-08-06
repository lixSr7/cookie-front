import { ChatsLineChart } from "./components/firstChart";
import PieChart from "./components/secondChart";

export default function Analitycs() {
  return (
    <>
      <article>
        <section>
          <h3>Chats</h3>
        </section>
        <section className="flex flex-col items-end m-auto gap-3">
          <div className="flex flex-col w-full h-full max-w-[500px] max-h-[600px]">
            <ChatsLineChart />
            <PieChart />
          </div>
        </section>
      </article>
    </>
  );
}
