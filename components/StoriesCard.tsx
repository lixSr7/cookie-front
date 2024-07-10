'use client';
import { Card, Image, CardFooter } from "@nextui-org/react";
import { Plus as PlusIcon } from "@geist-ui/icons";

function StoriesCard() {
  const images = [
    "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    "https://imgs.search.brave.com/pZMU-6ngilZ3wSyZyS3e1Sdtp8XzPt_WeK294Lt42pU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9lbGNv/bWVyY2lvLnBlL3Jl/c2l6ZXIvM095UE1k/SU9nUG5NVEhlUnMy/WWxVWDE0OVQ4PS80/NjV4MC9zbWFydC9m/aWx0ZXJzOmZvcm1h/dChqcGVnKTpxdWFs/aXR5KDc1KS9jbG91/ZGZyb250LXVzLWVh/c3QtMS5pbWFnZXMu/YXJjcHVibGlzaGlu/Zy5jb20vZWxjb21l/cmNpby9XSFA2RUpC/STdWQUtQSEVISEtK/UVdSREMzUS5wbmc",
    "https://imgs.search.brave.com/6uuyyA_-a6ZvE21bGE6tHrwrxFpA3Wis885_9m8-KSo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTEucG9wc3VnYXIt/YXNzZXRzLmNvbS9m/aWxlcy90aHVtYm9y/L3BacFVVbkJndjVq/UlZaNDhPeDlHNWh2/LVJBUT0vZml0LWlu/Lzc5Mng1NDQvdG9w/L2ZpbHRlcnM6Zm9y/bWF0X2F1dG8oKTp1/cHNjYWxlKCkvMjAy/NC8wMS8yMi8xNzAv/bi8xOTIyMjgzL3Rt/cF9FNklDbDBfZjQ2/ZjQ2MDJlNDkwNjRm/MF9NYWluX1BTMjRf/SnVudG9zX0FyY2Fu/Z2VsXzE0NTZ4MTAw/MC5qcGc",
  ];
  return (
    <Card className="max-w-[22em] min-[1920px]:max-w-[25em] max-h-[45%] min-h-[45%] h-full gap-2 grid grid-cols-2 grid-rows-2 p-4">
      <button className="grid w-full h-full place-content-center bg-[#dd2525] rounded-xl dark:bg-[#dd2525] ">
        <PlusIcon className=" stroke-white w-7 h-7" />
      </button>
      {images.map((image, index) => (
        <Card isFooterBlurred key={index} className="w-full">
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 object-cover w-full h-full"
            src={image}
          />
          <CardFooter className="absolute bottom-0 z-10 bg-black/40 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex items-center flex-grow gap-2">
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">
                  Get a good nights sleep.
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </Card>
  );
}

export default StoriesCard;
