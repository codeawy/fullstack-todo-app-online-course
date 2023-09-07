import { ChangeEvent, FormEvent, useState } from "react";
import axiosInstance from "../config/axios.config";
import useCustomQuery from "../hooks/useCustomQuery";
import { ITodo } from "../interfaces";
import { onGenerateTodos } from "../utils/functions";
import TodoSkeleton from "./TodoSkeleton";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [queryVersion, setQueryVersion] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ** Handlers
  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModal(false);
  };

  const onOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsEditModalOpen(false);
  };
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };

  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };
  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };

  const onChangeAddTodoHandler = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = evt.target;

    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };

  const onChangeHandler = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = evt.target;

    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onSubmitRemoveTodo = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        closeConfirmModal();
        setQueryVersion(prev => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitAddTodo = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsUpdating(true);

    const { title, description } = todoToAdd;

    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData.user.id] } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status === 200) {
        onCloseAddModal();
        setQueryVersion(prev => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitUpdateTodo = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsUpdating(true);

    const { title, description } = todoToEdit;

    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status === 200) {
        onCloseEditModal();
        setQueryVersion(prev => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button size={"sm"} onClick={onOpenAddModal}>
              Post new todo
            </Button>
            <Button variant={"outline"} size={"sm"} onClick={onGenerateTodos}>
              Generate todos
            </Button>
          </div>
        )}
      </div>

      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <>
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">
                {todo.id} - {todo.title}
              </p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                  Edit
                </Button>
                <Button variant={"danger"} size={"sm"} onClick={() => openConfirmModal(todo)}>
                  Remove
                </Button>
              </div>
            </div>
          </>
        ))
      ) : (
        <h3>No todos yet!</h3>
      )}

      {/* Add todo modal */}
      <Modal isOpen={isOpenAddModal} closeModal={onCloseAddModal} title="Add a new todo">
        <form className="space-y-3" onSubmit={onSubmitAddTodo}>
          <Input name="title" value={todoToAdd.title} onChange={onChangeAddTodoHandler} />
          <Textarea name="description" value={todoToAdd.description} onChange={onChangeAddTodoHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating}>
              Done
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit todo modal */}
      <Modal isOpen={isEditModalOpen} closeModal={onCloseEditModal} title="Edit this todo">
        <form className="space-y-3" onSubmit={onSubmitUpdateTodo}>
          <Input name="title" value={todoToEdit.title} onChange={onChangeHandler} />
          <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating}>
              Update
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE TODO CONFIRM MODAL */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button variant={"danger"} size={"sm"} onClick={onSubmitRemoveTodo}>
            Yes, remove
          </Button>
          <Button type="button" variant={"cancel"} size={"sm"} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
