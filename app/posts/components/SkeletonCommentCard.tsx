import { Skeleton, Card } from "@nextui-org/react";

/**
 * Componente de marcador de posición para comentarios en carga.
 * Renderiza un esqueleto de carga que simula la estructura de una tarjeta de comentario.
 * Utiliza el componente Skeleton de NextUI para mostrar una representación visual
 * de cómo se verá un comentario mientras se carga la información real.
 *
 * @returns {JSX.Element} - El componente SkeletonCommentCard renderizado.
 */
function SkeletonCommentCard() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Card className="w-full space-y-5 p-4" radius="lg">
        <div className="flex w-full justify-between">
          <div className=" flex flex-col gap-3">
            <div>
              <Skeleton className="w-12 h-12 rounded-full">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
            </div>
            <div className="space-y-3">
              <Skeleton className="w-64 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton className="w-40 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-secondary"></div>
          </Skeleton>
        </div>

        <Skeleton className="rounded-lg">
          <div className="h-36 rounded-lg bg-secondary"></div>
        </Skeleton>
      </Card>
    </div>
  );
}

export default SkeletonCommentCard;
