import { ChangeEvent, useState } from "react";
import Paginator from "../components/Paginator";
import Button from "../components/ui/Button";
import useCustomQuery from "../hooks/useCustomQuery";
import { onGenerateTodos } from "../utils/functions";

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("DESC");

  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
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
  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  if (isLoading) return <h3>Loading..</h3>;

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-x-2">
        <Button size={"sm"} onClick={onGenerateTodos} title="Generate 100 records">
          Generate todos
        </Button>
        <div className="flex items-center justify-between space-x-2 text-md">
          <select className="border-2 border-indigo-600 rounded-md p-2" value={sortBy} onChange={onChangeSortBy}>
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>

          <select className="border-2 border-indigo-600 rounded-md p-2" value={pageSize} onChange={onChangePageSize}>
            <option disabled>Page size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
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
