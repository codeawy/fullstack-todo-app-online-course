import { useState, ChangeEvent, FormEvent } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

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
  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
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

  const onRemove = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        closeConfirmModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitAddTodoHandler = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsUpdating(true);

    const { title, description } = todoToAdd;

    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status === 200) {
        onCloseAddModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const submitHandler = async (evt: FormEvent<HTMLFormElement>) => {
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
        <Button size={"sm"} onClick={onOpenAddModal}>
          Post new todo
        </Button>
      </div>

      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
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
        ))
      ) : (
        <h3>No todos yet!</h3>
      )}

      {/* Add todo modal */}
      <Modal isOpen={isOpenAddModal} closeModal={onCloseAddModal} title="Edit this todo">
        <form className="space-y-3" onSubmit={submitAddTodoHandler}>
          <Input name="title" value={todoToAdd.title} onChange={onChangeAddTodoHandler} />
          <Textarea name="description" value={todoToAdd.description} onChange={onChangeAddTodoHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating}>
              Done
            </Button>
            <Button variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit todo modal */}
      <Modal isOpen={isEditModalOpen} closeModal={onCloseEditModal} title="Edit this todo">
        <form className="space-y-3" onSubmit={submitHandler}>
          <Input name="title" value={todoToEdit.title} onChange={onChangeHandler} />
          <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating}>
              Update
            </Button>
            <Button variant={"cancel"} onClick={onCloseEditModal}>
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
          <Button variant={"danger"} size={"sm"} onClick={onRemove}>
            Yes, remove
          </Button>
          <Button variant={"cancel"} size={"sm"} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
