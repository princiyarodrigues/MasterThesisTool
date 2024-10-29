'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreVertical, Plus, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const columnStyles = {
  backlog: {
    header: 'bg-gray-100',
    badge: 'bg-gray-200 text-gray-700',
    icon: Clock
  },
  'in-progress': {
    header: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    icon: ArrowRight
  },
  review: {
    header: 'bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
    icon: AlertCircle
  },
  done: {
    header: 'bg-green-50',
    badge: 'bg-green-100 text-green-700',
    icon: CheckCircle
  }
};

export function KanbanBoard({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [newCardColumn, setNewCardColumn] = useState(null);

  const columns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' }
  ];

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(result.source.index, 1);
    movedItem.status = result.destination.droppableId;
    newItems.splice(result.destination.index, 0, movedItem);

    setItems(newItems);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const AddNewCardForm = ({ columnId }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <textarea
        className="w-full p-2 border border-gray-200 rounded-md text-sm"
        placeholder="Enter card title..."
        rows="2"
      />
      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={() => {
            setIsAddingNewCard(false);
            setNewCardColumn(null);
          }}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Card
        </button>
      </div>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col h-full">
            {/* Column Header */}
            <div className={`rounded-t-lg ${columnStyles[column.id].header} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {React.createElement(columnStyles[column.id].icon, { className: 'h-5 w-5' })}
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${columnStyles[column.id].badge}`}>
                    {items.filter(item => item.status === column.id).length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsAddingNewCard(true);
                    setNewCardColumn(column.id);
                  }}
                  className="p-1 hover:bg-white/20 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Column Content */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-4 rounded-b-lg bg-gray-50 min-h-[500px] ${
                    snapshot.isDraggingOver ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {isAddingNewCard && newCardColumn === column.id && (
                      <AddNewCardForm columnId={column.id} />
                    )}
                    {items
                      .filter(item => item.status === column.id)
                      .map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()} // Ensure ID is a string
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg shadow-sm p-4 border border-gray-200 ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900">
                                  {item.title}
                                </h4>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-2">
                                {item.description}
                              </p>
                              
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex space-x-2">
                                  {item.priority && (
                                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                                      {item.priority}
                                    </span>
                                  )}
                                  {item.tags?.map(tag => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
