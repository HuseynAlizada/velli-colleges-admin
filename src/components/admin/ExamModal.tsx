import type React from "react"
import { useState } from "react"
import CloseIcon from '@mui/icons-material/Close';

export default function ExamModal({ closePopUp }: { closePopUp: () => void }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    })
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormData({ name: "", description: "" }) // Reset form
    }

    return (
        <div className="bg-white rounded-lg w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-rose-500 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-semibold">Levels</h2>
                <button className="text-white hover:text-gray-200 transition-colors" onClick={closePopUp}>
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Level Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Description"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    >
                        Add Level
                    </button>
                </div>
            </form>
        </div>
    )
}

