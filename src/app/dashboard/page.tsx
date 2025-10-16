'use client';
import Image from 'next/image';
import { useState, useEffect, useRef} from 'react';
import { useRouter } from "next/navigation"

import { Card, CardContent,} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import Cookies from 'js-cookie';
import axios from '../axios';

import profileUser from '@/../public/profile.png';
import star from '@/../public/star.png';
import done from '@/../public/done-check.svg';
import undone from '@/../public/undone-check.svg';

type Todo = {
    id: string;
    item: string;
    isDone: boolean;
};

export default function UserDashboard() {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const debounceRef = useRef<number | null>(null);

    const username = Cookies.get('user') || 'User';
    const router = useRouter()
    const getTodos = async (query:string) => {
        try {
            const response = await axios.get(`/todos?searchFilters={"item":"${query}"}`);
            setTodoList(response.data.content.entries);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };
    const handleSearchDebounced = (query:string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
            getTodos(query);
        }, 500);
    };
    useEffect(() => {
        getTodos('');
    },[]);

    const handleStatusChange = async (id: string, isDone: boolean) => {
        try {
            const action = isDone ? 'UNDONE' : 'DONE';
            const response = await axios.put(`/todos/${id}/mark`, { action });
            console.log(response.data);
            setTodoList((prevTodoList) =>
                prevTodoList.map((todo) =>
                    todo.id === id ? { ...todo, isDone: !isDone } : todo
                )
            );
        } catch (error) {
            console.error(`Error updating todo status: ${error}`);
        }
    };
    const handleAddTodo = async (e:React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            const response = await axios.post('/todos', { item: newTodo });
            setTodoList([...todoList, response.data.content]);
            setNewTodo('');
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    }
    const handleDeleteSelected = async () => {
    try {
        for (const id of selectedValues) {
            await axios.delete(`/todos/${id}`);
            }
            const response = await axios.get('/todos');
            setTodoList(response.data.content.entries);
            setSelectedValues([]); 
        } catch (error) {
            console.error("Error deleting selected todos:", error);
        }
    };
    const handleLogOut = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        Cookies.remove('user');
        router.push('/login');
    }
    

    return (
        <div className='flex flex-col items-center w-full h-screen bg-[#E6E6E6]'>
            <div className="bg-[url('/bg-shape.svg')] w-full h-screen bg-no-repeat bg-position-[0_-140px] bg-contain flex flex-col items-center justify-center">

                <div className='flex w-screen items-center justify-between px-10 mt-3 gap-10'>
                    <div className='flex ' >
                        <Image src={star} width={40} alt="Star Icon" />
                        <Input 
                        id='search'
                        placeholder='search (ctrl+/)'
                        value={searchValue}
                        onChange={e => {
                            setSearchValue(e.target.value);
                            handleSearchDebounced(e.target.value);
                        }}/>
                    </div>
                    <Popover >
                        <PopoverTrigger className='w-56' asChild>
                            <div className='flex items-center gap-2 cursor-pointer'>
                                <h1>{username}</h1>
                                <Image src={profileUser} width={40} alt="" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-50 flex items-center justify-center">
                            <Button variant='destructive' onClick={handleLogOut} className='w-full'>
                                Log Out
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-[46px]  font-[700] text-[#174286]">To Do</h1>
                    <Card className="w-full max-w-[800px]">
                        <CardContent className='flex flex-col gap-4'>
                            <p>add a new task</p>
                            <form className="flex flex-col gap-4" onSubmit={handleAddTodo}>
                                <div className="flex w-full items-center gap-10">
                                    <input type="text   " 
                                    value={newTodo} 
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    placeholder="add new todo"
                                    className=' appearance-none border-b-4 border-black w-full text-[30px]' />
                                    <Button type='submit' variant="outline" className='bg-[#0062FF] text-[25px] px-5 py-7 text-white  font-[600]'>
                                        Add Todo
                                    </Button>
                                </div>
                                {todoList.length > 0 ? (
                                    <div className='my-5 max-h-64 overflow-y-auto' >
                                        {todoList.map((todo) => (
                                            <div  key={todo.id}>
                                                <div className='flex justify-between py-4 px-5'>
                                                    <div className='flex items-center gap-4'>
                                                        <input 
                                                            type="checkbox"
                                                            id={todo.id} 
                                                            checked={selectedValues.includes(todo.id)} 
                                                            className='cursor-pointer w-6 h-6'
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                setSelectedValues((prev) => [...prev, todo.id]);
                                                                } else {
                                                                setSelectedValues((prev) => prev.filter((id) => id !== todo.id));
                                                                }
                                                            }} 
                                                            />
                                                        <Label className='text-[20px]' htmlFor={todo.id}>{todo.item}</Label>
                                                    </div>
                                                    <button onClick={() => handleStatusChange(todo.id, todo.isDone)}>
                                                        <Image 
                                                            src={todo.isDone ? done : undone} 
                                                            width={20} 
                                                            height={20} 
                                                            alt={todo.isDone ? "Done" : "Undone"} 
                                                        />

                                                    </button>
                                                </div>
                                                <Separator className="my-2" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No todos available</p>
                                )}
                                <div>
                                    <Button variant='destructive' 
                                    onClick={handleDeleteSelected}
                                    disabled={selectedValues.length === 0}
                                    >deleted selected</Button>
                                </div>
                            </form>
                        </CardContent>
                            
                    </Card>
                    
                </div>
            </div>
        </div>
    )
}