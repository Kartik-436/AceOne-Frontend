/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';

const Dashboard = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    return (
        <>
            <Transition animate={animate} />

            <div className='w-full flex flex-col gap-5'>
                <div className='w-full flex items-center justify-between pr-3'>
                    <div className='w-full flex gap-3 items-center'>
                        <div>
                            <div className='w-20 h-20 p-1 rounded-full bg-black'>
                                <img src="ShoeBG-1.jpg" alt="OwnerPicture" className='w-full h-full object-cover rounded-full text-white' />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <h1 className='font-[nunito] font-semibold text-black'>Hi, Owner</h1>
                            <h1 className='font-[nunito] font-semibold text-2xl text-black -mt-1'>Welcome Back !</h1>
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-end gap-5'>
                        <div className='w-full'>
                            <OwnerSearch />
                        </div>

                        <div>
                            <button
                                id="NavBarButtons"
                                className="px-6 py-2 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90 text-nowrap"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-evenly gap-5'>
                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="CompletedOrders.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Orders Completed</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>500K</h1>
                        </div>
                    </div>

                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="PendingOrders.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Orders Pending</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>10K</h1>
                        </div>
                    </div>

                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="CencelledOrders.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Orders Cancelled</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>5K</h1>
                        </div>
                    </div>

                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="TotalUsers.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Total Users</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>500M</h1>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className='flex items-center justify-between w-full'>
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>Orders Stats</h1>
                        <div className='pr-12'>
                            <SortByMenu />
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <div className='py-3 pl-5 grid grid-cols-7 bg-gray-300'>
                            <h1 className='col-span-2'>Product</h1>
                            <h1>Quantity</h1>
                            <h1>Status</h1>
                            <h1>Date & Time</h1>
                            <h1>Total Price</h1>
                            <h1>Mode Of Payment</h1>
                        </div>

                        <div className='py-3 pl-5 grid grid-cols-7 bg-white border-b-4 border-gray-300'>
                            <h1 className='col-span-2'>Product</h1>
                            <h1>Quantity</h1>
                            <h1>Status</h1>
                            <h1>Date & Time</h1>
                            <h1>Total Price</h1>
                            <h1>Mode Of Payment</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
