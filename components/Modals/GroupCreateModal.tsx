import axios from 'axios'
import React from 'react'
import Select from 'react-select'
import { IoMdClose } from 'react-icons/io'

import Modal from './Modal'
import { Conversation, User } from '@prisma/client'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import Input from '@/components/Input'
import { useAppSelector } from '@/redux/hooks'
import { toast } from 'react-hot-toast'

interface InputProps {
    isOpen: boolean,
    onClose: () => void,
    allUsers: User[],
    defaultValues: {
        name: string,
    }
    isUpdate: boolean
    conversation?: Conversation & {
        users: User[]
    }
}
const GroupCreateModal: React.FC<InputProps> = ({ conversation, isOpen, onClose, allUsers, defaultValues, isUpdate }) => {

    const { mode } = useAppSelector((state) => state.user)

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: defaultValues
    })
    const members = watch('members')

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        let allUsers: string[];
        onClose()
        if (!isUpdate && data.members.length < 2) {
            toast.error("Atleast 3 members required")
            return
        }
        if (data.members && data.members.length > 0)
            allUsers = data.members.map((user: any) => user.label)

        if (isUpdate) {
            await axios.put('/api/conversation', { ...data, isGroup: true, conversationId: conversation?.id }).then(async () => {
                if (conversation && allUsers && allUsers.length > 0)
                    await axios.post('/api/message', { text: `added ${allUsers.join(',')}`, messageType: "user", conversationId: conversation?.id })
            })
        } else {
            await axios.post('/api/conversation', { ...data, isGroup: true }).then(async (data) => {
                const conversationData = data.data.conversation
                await axios.post('/api/message', { text: `created the group`, conversationId: conversationData.id, messageType: "user" });
                await axios.post('/api/message', { text: `added ${allUsers.join(',')}`, messageType: "user", conversationId: conversationData.id })
            })
        }
        setValue('members', [])
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='flex justify-between items-center border-b pb-1.5'>
                <h1 className='font-bold text-xl  pb-2'>Create a group chat</h1>
                <button onClick={onClose}>
                    <IoMdClose size={24} />
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className='py-3'>
                        <Input
                            id='name'
                            label='Enter Group Name'
                            placeholder='Group Name'
                            register={register}
                            disabled={false}
                            required
                            type='text'
                            error={errors}
                        />
                    </div>
                    <div>
                        <label htmlFor="" className='font-semibold text-sm'>Select Users</label>
                        <Select
                            options={allUsers.map((user) => ({
                                value: user.id,
                                label: user.name
                            }))}
                            onChange={(value) => setValue('members', value, {
                                shouldValidate: true
                            })}
                            isMulti
                            value={members}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 })
                            }}
                            classNames={{
                                control: () => 'text-sm',
                            }}
                        />
                    </div>
                    <div className='flex justify-end pt-4'>
                        <button type='submit' className={`${mode === 'dark' ? 'bg-white text-black' : 'bg-[#272a39] text-white'} px-2 py-1 rounded font-semibold`}>
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default GroupCreateModal