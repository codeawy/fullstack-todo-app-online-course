import Paginator from "../components/Paginator";
import useCustomQuery from "../hooks/useCustomQuery";

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useCustomQuery({
    queryKey: ["paginatedTodos"],
    url: "/todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading) return <h3>Loading..</h3>;

  return (
    <div className="my-20 space-y-6">
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
      <Paginator />
    </div>
  );
};

export default TodosPage;
