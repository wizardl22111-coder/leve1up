'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

const BannersAdmin = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      // For now, we'll create a simple fetch - you can implement the API route later
      // const response = await fetch('/api/admin/banners')
      // if (!response.ok) throw new Error('Failed to fetch banners')
      // const data = await response.json()
      // setBanners(data.banners)
      
      // Placeholder data for now
      setBanners([
        {
          id: '1',
          title: 'Summer Sale',
          description: 'Get up to 50% off on selected items',
          image_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
          link_url: '/products?sale=true',
          is_active: true,
          display_order: 1,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setShowModal(true)
  }

  const handleDelete = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      // const response = await fetch(`/api/admin/banners/${bannerId}`, {
      //   method: 'DELETE'
      // })
      // if (!response.ok) throw new Error('Failed to delete banner')
      
      // For now, just remove from local state
      setBanners(prev => prev.filter(b => b.id !== bannerId))
    } catch (err) {
      alert('Error deleting banner: ' + err.message)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingBanner(null)
    fetchBanners()
  }

  const toggleBannerStatus = async (bannerId, currentStatus) => {
    try {
      // const response = await fetch(`/api/admin/banners/${bannerId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ is_active: !currentStatus })
      // })
      // if (!response.ok) throw new Error('Failed to update banner')
      
      // For now, just update local state
      setBanners(prev => prev.map(b => 
        b.id === bannerId ? { ...b, is_active: !currentStatus } : b
      ))
    } catch (err) {
      alert('Error updating banner: ' + err.message)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage promotional banners and announcements
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Banner
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">Error: {error}</div>
          </div>
        )}

        {/* Banners Grid */}
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={banner.image_url}
                    alt={banner.title}
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {banner.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {banner.description}
                      </p>
                      {banner.link_url && (
                        <p className="mt-2 text-sm text-indigo-600">
                          Link: {banner.link_url}
                        </p>
                      )}
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Display Order:</span> {banner.display_order}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {new Date(banner.created_at).toLocaleDateString()}
                        </div>
                        {banner.start_date && (
                          <div>
                            <span className="font-medium">Start Date:</span>{' '}
                            {new Date(banner.start_date).toLocaleDateString()}
                          </div>
                        )}
                        {banner.end_date && (
                          <div>
                            <span className="font-medium">End Date:</span>{' '}
                            {new Date(banner.end_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                        className={`px-3 py-1 text-xs font-medium rounded-md ${
                          banner.is_active
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {banner.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <span className="text-4xl">🖼️</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new banner.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Banner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={handleModalClose}
        />
      )}
    </AdminLayout>
  )
}

const BannerModal = ({ banner, onClose }) => {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    image_url: banner?.image_url || '',
    link_url: banner?.link_url || '',
    display_order: banner?.display_order || 1,
    is_active: banner?.is_active !== false,
    start_date: banner?.start_date ? banner.start_date.split('T')[0] : '',
    end_date: banner?.end_date ? banner.end_date.split('T')[0] : ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // const url = banner 
      //   ? `/api/admin/banners/${banner.id}`
      //   : '/api/admin/banners'
      
      // const response = await fetch(url, {
      //   method: banner ? 'PUT' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formData)
      // })

      // if (!response.ok) throw new Error('Failed to save banner')
      
      // For now, just close the modal
      onClose()
    } catch (err) {
      alert('Error saving banner: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {banner ? 'Edit Banner' : 'Add Banner'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Banner Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <input
              type="url"
              placeholder="Link URL (optional)"
              value={formData.link_url}
              onChange={(e) => setFormData({...formData, link_url: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              min="1"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Start Date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="date"
                placeholder="End Date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="mr-2"
              />
              Active
            </label>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BannersAdmin
