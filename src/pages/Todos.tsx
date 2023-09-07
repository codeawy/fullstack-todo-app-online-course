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

  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todos-page-${page}`],
    url: `/todos?pagination[pageSize]=10&pagination[page]=${page}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  console.log(isLoading, isFetching);

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
        <Button size={"sm"} onClick={onGenerateTodos} title="Generate 100 records">
          Generate todos
        </Button>
      </div>

      <div className="my-10">
        {data.data.length ? (
          data.data.map(({ id, attributes }: { id: number; attributes: { title: string } }) => (
            <div
              key={id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <h3 className="w-full font-semibold">
                {id} - {attributes.title}
              </h3>
            </div>
          ))
        ) : (
          <h3>No todos yet!</h3>
        )}
        <Paginator
          page={page}
          pageCount={data.meta.pagination.pageCount}
          total={data.meta.pagination.total}
          isLoading={isLoading || isFetching}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
      </div>
    </section>
  );
};

export default TodosPage;
