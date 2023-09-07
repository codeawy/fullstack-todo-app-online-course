import { useState } from "react";
import Paginator from "../components/Paginator";
import Button from "../components/ui/Button";
import useCustomQuery from "../hooks/useCustomQuery";
import { onGenerateTodos } from "../utils/functions";

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [page, setPage] = useState<number>(1);

  const { isLoading, data } = useCustomQuery({
    queryKey: ["paginatedTodos", `${page}`],
    url: "/todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ** Handlers
  const onClickPrev = () => {
    setPage(prev => prev - 1);
  };
  const onClickNext = () => {
    setPage(prev => prev + 1);
  };

  if (isLoading) return <h3>Loading..</h3>;

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center space-x-2">
        <Button size={"sm"} onClick={onGenerateTodos}>
          Generate todos
        </Button>
      </div>

      <div className="my-10 space-y-6">
        {data.data.length ? (
          data.data.map(({ id, attributes }: { id: number; attributes: { title: string } }, idx: number) => (
            <div
              key={id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <h3 className="w-full font-semibold">
                {id} - {idx + 1} - {attributes.title}
              </h3>
            </div>
          ))
        ) : (
          <h3>No todos yet!</h3>
        )}
        <Paginator page={page} pageCount={3} onClickPrev={onClickPrev} onClickNext={onClickNext} />
      </div>
    </section>
  );
};

export default TodosPage;
