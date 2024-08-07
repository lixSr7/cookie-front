import { Skeleton, Card } from "@nextui-org/react";

function SkeletonPosts() {
  return (
    <>
      <SkeletonPostCard />
      <SkeletonPostCard />
      <SkeletonPostCard />
    </>
  );
}

export function SkeletonPostCard() {
  return (
    <article className="block w-full max-w-3xl p-4 m-auto rounded-md">
      <Card className="block w-full rounded-md">
        <SkeletonPostCardHeader />
        <SkeletonPostCardBody />
        <SkeletonPostCardFooter />
      </Card>
    </article>
  );
}

function SkeletonPostCardHeader() {
  return (
    <div className="flex justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="w-24 h-4 mb-1 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>
    </div>
  );
}

function SkeletonPostCardBody() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <Skeleton className="w-full h-4 mb-3 rounded-md" />
      <Skeleton className="w-full h-48 rounded-md" />
    </div>
  );
}

function SkeletonPostCardFooter() {
  return (
    <div className="flex items-center justify-between w-full p-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>
    </div>
  );
}

export default SkeletonPosts;
