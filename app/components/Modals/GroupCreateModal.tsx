import React from 'react'
import Modal from './Modal'
import { User } from '@prisma/client'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import Input from '@/app/(site)/components/Input'
import Select from 'react-select'
import axios from 'axios'
import { useAppSelector } from '@/app/redux/hooks'
interface InputProps {
    isOpen: boolean,
    onClose: () => void,
    allUsers: User[],
    defaultValues: {
        name: string,
    }
    isUpdate: boolean
}
const GroupCreateModal: React.FC<InputProps> = ({ isOpen, onClose, allUsers, defaultValues, isUpdate }) => {

    const { currConversation } = useAppSelector((state) => state.conversation)

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: defaultValues
    })
    const members = watch('members')
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        let allUsers: string[];
        if (data.members && data.members.length > 0)
            allUsers = data.members.map((user: any) => user.label)

        onClose()
        if (isUpdate) {

            await axios.post('/api/conversation', { ...data, isGroup: true, conversationId: currConversation?.id }).then(async () => {
                if (currConversation && allUsers && allUsers.length > 0)
                    await axios.post('/api/message', { text: `added ${allUsers.join(',')}`, messageType: "user", conversationId: currConversation?.id })
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <h1 className='font-bold'>Create a group chat</h1>
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
                    <div className='flex justify-end gap-4 pt-4 items-center'>
                        <button className='px-2 py-1' onClick={onClose}>
                            Cancel
                        </button>
                        <button type='submit' className='bg-b-light1 text-white px-2 py-1 rounded font-semibold'>
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default GroupCreateModal