'use client'

import { useState, useEffect, useRef, Suspense } from "react"
import {PaginationWithLinks} from "@/components/ui/pagination-with-links"

import { Button } from "@/components/ui/button"

import { Sidebar,
    SidebarContent,
    SidebarTrigger,
    SidebarHeader,

    SidebarProvider,
    SidebarMenuItem
 } from "@/components/ui/sidebar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {Select
    , SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"
import {Table, 
    TableHeader, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow} from "@/components/ui/table"

import axios from "../axios"

import arrow from "@/../public/arrow.svg"
import home from "@/../public/home.svg"
import profileUser from '@/../public/profile.png';
import searchLogo from '@/../public/search.svg';


import { useSearchParams,useRouter } from "next/navigation"
import Image from "next/image"
import Cookies from "js-cookie"

interface Todo {
    id: string;
    item: string;
    isDone: boolean;
    user: {
        fullName: string;
    };
}

export default function AdminDashboardPage() {
    return (

        <Suspense fallback={<div>Loading...</div>}>
            <AdminDashboardPageContent />
    </Suspense>
    )
}

function AdminDashboardPageContent() {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [totalData, setTotalData] = useState(0);
    const debounceRef = useRef<number | null>(null);
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 9;
    
    const getTodos = async(query:string, status:string|boolean|null, currentPage: number)=>{
        console.log("Fetching todos with query:", query, "status:", status, "page:", currentPage);
        if(status === "all") {
            status = null;
        }else if(status === "true") {
            status = true;
        }else if(status === "false") {
            status = false;
        }

        try {
            const queryParams = {
                searchFilters: JSON.stringify({ item: query }),
                filters: JSON.stringify({ isDone: status}),
                page: currentPage,
                rows: pageSize,
            };

            const response = await axios.get(`/todos`, { params: queryParams });
            setTodos(response.data.content.entries);
            setTotalData(response.data.content.totalData);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    }
    const handleSearchDebounced = (query:string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
            getTodos(query,statusFilter, page);
        }, 800);
    };

    const updateQueryParams = () => {
        const queryParams = new URLSearchParams();
        queryParams.set('search', searchValue);
        queryParams.set('status', statusFilter);
        queryParams.set('page', page.toString());
        queryParams.set('pageSize', pageSize.toString());
        router.push(`?${queryParams.toString()}`, { scroll: false });
    }

    useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
        const statusQuery = searchParams.get('status') || 'all';
        setSearchValue(searchQuery);
        setStatusFilter(statusQuery);

        getTodos(searchQuery, statusQuery, page);
    }, [searchParams, page, pageSize]);

    useEffect(() => {
        updateQueryParams();
    }, [searchValue, statusFilter, page]);

    const username = Cookies.get('user') || 'User';
    const router = useRouter()
    const handleLogOut = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        Cookies.remove('user');
        router.push('/login');
    }
    return (
        <div className="w-full h-screen flex bg-[#54556414]">
            <SidebarProvider className="w-max bg-white text-black">
                <Sidebar className="p-4">
                    <SidebarHeader>
                        <h1>NODEWAVE</h1>
                    </SidebarHeader>
                    <SidebarContent className="w-full">
                        <SidebarMenuItem className="flex my-1 px-2 py-1 w-full bg-[#4C4E6414] rounded-2xl items-center gap-2" >
                            <Image src={home} alt="Home" className="w-6 h-6" />
                            <span>Home</span>
                        </SidebarMenuItem>
                    </SidebarContent>
                
                </Sidebar>
                <SidebarTrigger className="bg-white text-black">
                    <Image src={arrow} alt="arrow" className="w-6 h-6" />
                </SidebarTrigger>

            </SidebarProvider>
            <div className="w-full flex flex-col  ">
                <div className='bg-white flex w-full items-end justify-end px-10 py-3 gap-10'>
                    <Popover >
                        <PopoverTrigger className='w-max' asChild>
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
                <div className="p-10">
                    <h1 className=" text-4xl font-medium" >To Do</h1>
                    <div className="flex flex-col gap-4 p-8 rounded-2xl mt-5 bg-white w-full">
                        <div  className="flex w-[450px] gap-5">
                            <div className="flex w-full items-center gap-2">
                                <input type="text   " 
                                value={searchValue}
                                onChange={e => {
                                    setSearchValue(e.target.value);
                                    handleSearchDebounced(e.target.value);
                                }}                              
                                placeholder="search"
                                className=" appearance-none border-b-1 border-black w-[150px] bg-no-repeat bg-size-[15px]  bg-left pl-8 "
                                style={{backgroundImage:`url(${searchLogo.src})`}} />
                                <Button type='submit' variant="outline" className='bg-[#0062FF]  px-5 py-1 text-white  font-[400]'>
                                    search
                                </Button>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full" >
                                        <SelectValue placeholder="filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup >
                                            <SelectLabel >status</SelectLabel>
                                            <SelectItem value={"all"}>all</SelectItem>
                                            <SelectItem value={"true"}>done</SelectItem>
                                            <SelectItem value={"false"}>undone</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                 </Select>
                            </div>
                        </div>
                        <div>
                            <Table>
                            
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Name</TableHead>
                                    <TableHead className="w-[300px]">To Do</TableHead>
                                    <TableHead className="w-[300px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {todos.length === 0 ? (
                                    <h1>No todos found</h1>
                                ) : (
                                    todos.map((todo) => (
                                        <TableRow key={todo.id}>
                                            <TableCell>{todo.user.fullName}</TableCell>
                                            <TableCell>{todo.item}</TableCell>
                                        <TableCell className="w-[300px]">{todo.isDone ? <h1 className="bg-[#70DE54] px-4 py-1 rounded-3xl w-max">Done</h1> : <h1 className="bg-[#FC5A5A] px-4 py-1 rounded-3xl w-max">Undone</h1>}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            </Table>
                        </div>
                        <div>
                            <PaginationWithLinks
                                page={page}
                                pageSize={pageSize}
                                totalCount={totalData}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}