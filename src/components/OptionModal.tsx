import React, { Dispatch, SetStateAction } from 'react'
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient.ts';

interface TypeOptionModal{
  onClose: () => void,
  fetchAll: () => void, 
  isEditing: "pinned" | "plain" | "archived" | "",
  setIsEditing: Dispatch<SetStateAction<"">>,
  selectedId: string[],
  setSelectedId: Dispatch<SetStateAction<string[]>>
}

export const OptionModal = ({onClose, fetchAll, isEditing, setIsEditing, selectedId, setSelectedId}) => {
  
  const closeAll = (): void => {
    setIsEditing("");
    setSelectedId([]);
    onClose();
    fetchAll();
  }
  
  const handleUnpin = async(): Promise<void> => {
    await supabase
    .from('secnote')
    .update({isPinned: false})
    .in('id', selectedId);
    closeAll();
  }
  
  const handleArchive = async(): Promise <void> => {
    await supabase
    .from('secnote')
    .update({isArchived: true, isPinned: false})
    .in('id', selectedId);
    closeAll();
  };
  
  const handleDelete = async(): Promise <void> => {
     await supabase
     .from("secnote")
     .delete()
     .in('id', selectedId);
     closeAll();
  }
  
  const handlePin = async(): Promise<void> => {
    await supabase
    .from('secnote')
    .update({isPinned: true})
    .in('id', selectedId);
    closeAll();
  }
  const handleRemoveArchived = async(): Promise<void> => {
    await supabase
    .from('secnote')
    .update({isArchived: false})
    .in('id', selectedId);
    closeAll();
  }
  
  
  return (
    <motion.div
    initial = {{opacity:0}}
    animate = {{opacity:1}}
    exit = {{opacity:0}}
    onClick = {onClose}
    className = 'fixed inset-0 flex z-40 flex-col justify-center items-center gap-4 bg-[#00000090]'
    >
      <div className = 'p-4 rounded bg-neutral-100 dark:bg-gray-800 text-gray-800 flex flex-col dark:text-neutral-100 w-11/12 sm:w-6/12 ' onClick = {(e) => e.stopPropagation()}>
       {
      isEditing === "pinned" ? <p onClick = {handleUnpin}className = 'p-2 w-full rounded cursor-pointer active:bg-gray-300 dark:active:bg-gray-600'>Unpin</p> : isEditing === "plain" && 
       <p onClick = {handlePin}className = 'cursor-pointer p-2 w-full rounded active:bg-gray-300 dark:active:bg-gray-600'>Pin</p> 
       }
       {
         
      isEditing === "archived" ? <p onClick = {handleRemoveArchived}className = 'p-2 w-full rounded active:bg-gray-300 cursor-pointer dark:active:bg-gray-600'>Remove from archived</p> : <p onClick = {handleArchive}className = 'p-2 cursor-pointer w-full rounded active:bg-gray-300 dark:active:bg-gray-600'>Archive</p>
       }
       <p onClick = {handleDelete}className = 'p-2 w-full rounded active:bg-gray-300 dark:active:bg-gray-600 cursor-pointer'>Delete</p>
       <p onClick = {closeAll} className = ' cursor-pointer p-2 w-full rounded active:bg-gray-300 dark:active:bg-gray-600'>Close</p>
      </div>
      <p className = ' text-neutral-200 text-xs'>Click anywhere outside to close.</p>
    </motion.div>
  )
}