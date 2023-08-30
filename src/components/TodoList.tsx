import Button from "./ui/Button";

const TodoList = () => {
  return (
    <div className="space-y-1 ">
      <div className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
        <p className="w-full font-semibold">1 - First Todo</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"}>Edit</Button>
          <Button variant={"danger"} size={"sm"}>
            Remove
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
        <p className="w-full font-semibold">2 - Second Todo</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"}>Edit</Button>
          <Button variant={"danger"} size={"sm"}>
            Remove
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
        <p className="w-full font-semibold">3 - Third Todo</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"}>Edit</Button>
          <Button variant={"danger"} size={"sm"}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
