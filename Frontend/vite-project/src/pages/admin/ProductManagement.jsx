import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { Plus, Edit3, Trash2, X, AlertTriangle } from 'lucide-react';

const ProductManagement = () => {
  // Group listing-related states to optimize render cycles
  const [listState, setListState] = useState({
    products: [],
    loading: true,
    showModal: false,
    currentProduct: null,
    error: '',
    successMsg: '',
    deleteConfirmId: null,
  });

  // Group form fields into a dedicated object
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: '',
    status: 'active',
  });

  const [imageFile, setImageFile] = useState(null);

  const { products, loading, showModal, currentProduct, error, successMsg, deleteConfirmId } = listState;
  const { name, description, price, quantity, category, image, status } = formState;

  const fetchProducts = async () => {
    setListState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await productService.getProducts({ page: 1, limit: 100 });
      if (response?.data) {
        setListState((prev) => ({
          ...prev,
          products: response.data.products || response.data || [],
          loading: false,
        }));
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
      setListState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setImageFile(null);
    setFormState({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      image: '',
      status: 'active',
    });
    setListState((prev) => ({
      ...prev,
      currentProduct: null,
      error: '',
      showModal: true,
    }));
  };

  const openEditModal = (product) => {
    setImageFile(null);
    setFormState({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      quantity: product.quantity || '',
      category: product.category || '',
      image: product.image || '',
      status: product.status || 'active',
    });
    setListState((prev) => ({
      ...prev,
      currentProduct: product,
      error: '',
      showModal: true,
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setListState((prev) => ({ ...prev, error: '', successMsg: '' }));

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', Number(price));
    formData.append('quantity', Number(quantity));
    formData.append('category', category);
    formData.append('status', status);
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('image', image);
    }

    try {
      if (currentProduct) {
        await productService.updateProduct(currentProduct._id, formData);
        setListState((prev) => ({ ...prev, successMsg: 'Product updated successfully!', showModal: false }));
      } else {
        await productService.createProduct(formData);
        setListState((prev) => ({ ...prev, successMsg: 'Product added successfully!', showModal: false }));
      }
      fetchProducts();
      setTimeout(() => {
        setListState((prev) => ({ ...prev, successMsg: '' }));
      }, 3000);
    } catch (err) {
      console.error(err);
      setListState((prev) => ({
        ...prev,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Operation failed. Verify inputs.',
      }));
    }
  };

  const handleDelete = async (productId) => {
    setListState((prev) => ({ ...prev, error: '', successMsg: '' }));
    try {
      await productService.deleteProduct(productId);
      setListState((prev) => ({
        ...prev,
        successMsg: 'Product deleted (soft delete) successfully.',
        deleteConfirmId: null,
      }));
      fetchProducts();
      setTimeout(() => {
        setListState((prev) => ({ ...prev, successMsg: '' }));
      }, 3000);
    } catch (err) {
      console.error(err);
      setListState((prev) => ({ ...prev, error: 'Failed to delete product.' }));
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="admin-dashboard-container">
        <div>
          <h1 className="admin-header-title">Inventory Catalog</h1>
          <p className="admin-header-desc">
            Manage products, adjust prices, edit quantity levels, or delete items.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-primary"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {successMsg && (
        <div style={{ background: '#f0fdf4', color: 'var(--color-success)', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: 'var(--color-danger)', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {deleteConfirmId && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle style={{ color: '#d97706' }} size={24} />
            <div>
              <strong style={{ color: '#92400e' }}>Soft Delete Product?</strong>
              <p style={{ fontSize: '13px', color: '#b45309', margin: '2px 0 0 0' }}>
                This product will be excluded from storefront browsing but remains in the database records.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => handleDelete(deleteConfirmId)} className="btn-cta" style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--color-danger)' }}>
              Confirm Delete
            </button>
            <button type="button" onClick={() => setListState((prev) => ({ ...prev, deleteConfirmId: null }))} style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main product log sheet table */}
      <div className="card admin-recent-orders-card">
        {loading ? (
          <div className="flex-center" style={{ padding: '64px 0', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading inventory sheet...</p>
          </div>
        ) : products.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
            No products in your catalog yet. Click "Add New Product" or head to Overview to seed demo products.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr className="admin-table-header-row">
                  <th className="admin-table-cell">PRODUCT</th>
                  <th className="admin-table-cell">CATEGORY</th>
                  <th className="admin-table-cell">PRICE</th>
                  <th className="admin-table-cell">STOCK QUANTITY</th>
                  <th className="admin-table-cell">STATUS</th>
                  <th className="admin-table-cell" style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="admin-table-body-row">
                    {/* Thumbnail and title */}
                    <td className="admin-table-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="product-card-thumb flex-center" style={{ width: '50px', height: '50px', margin: 0 }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="product-card-img" />
                        ) : (
                          <span style={{ fontSize: '9px', fontWeight: 600 }}>No Img</span>
                        )}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-text-main)' }}>{product.name}</strong>
                        <p className="admin-table-cell-muted" style={{ maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: '2px 0 0 0' }}>
                          {product.description}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="admin-table-cell" style={{ textTransform: 'capitalize' }}>{product.category}</td>

                    {/* Price */}
                    <td className="admin-table-cell" style={{ fontWeight: 700 }}>₹{product.price.toLocaleString('en-IN')}</td>

                    {/* Stock level */}
                    <td className="admin-table-cell">
                      <span style={{ fontWeight: 600, color: product.quantity <= 5 ? 'var(--color-danger)' : 'inherit' }}>
                        {product.quantity} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="admin-table-cell">
                      <span
                        style={{
                          background: product.status === 'active' ? '#dcfce7' : '#fee2e2',
                          color: product.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="admin-table-cell" style={{ textAlign: 'right' }}>
                      <div className="admin-table-cell-actions">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="admin-cell-action-btn flex-center"
                        >
                          <Plus size={16} style={{ display: 'none' }} />
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setListState((prev) => ({ ...prev, deleteConfirmId: product._id }))}
                          className="admin-cell-delete-btn flex-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Overlay Form (Unified for Create/Edit) */}
      {showModal && (
        <div className="modal-dim-backdrop">
          <div className="card modal-card-content animate-fade-in">
            {/* Modal Header */}
            <div className="modal-card-header">
              <h2 className="modal-card-title">
                {currentProduct ? 'Modify Product' : 'Add New Product'}
              </h2>
              <button type="button" onClick={() => setListState((prev) => ({ ...prev, showModal: false }))} className="modal-card-close-btn flex-center">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="auth-alert-danger">
                {error}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="modal-card-form">
              <div className="form-group">
                <label htmlFor="productName" className="form-label">Product Name</label>
                <input
                  id="productName"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Slim Wireless Mouse"
                  value={name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-input"
                  placeholder="Describe details, specifications..."
                  rows={3}
                  value={description}
                  onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">Price (₹)</label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="999"
                    value={price}
                    onChange={(e) => setFormState((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity" className="form-label">Stock Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    className="form-input"
                    placeholder="25"
                    value={quantity}
                    onChange={(e) => setFormState((prev) => ({ ...prev, quantity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input
                    id="category"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Electronics, Fashion"
                    value={category}
                    onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Listing Status</label>
                  <select
                    id="status"
                    className="form-input"
                    value={status}
                    onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value }))}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* File Upload Selector */}
                  <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: '10px', padding: '16px', textAlign: 'center', background: 'var(--color-bg-main)', cursor: 'pointer' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                        }
                      }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '24px' }}>📷</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {imageFile ? `Selected: ${imageFile.name}` : 'Click to Upload Image File'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Supports JPG, PNG, GIF up to 5MB (Saved to Cloudinary)
                      </span>
                    </div>
                  </div>

                  {/* Manual URL Fallback Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Or provide a manual image URL fallback:</span>
                    <input
                      id="image"
                      type="url"
                      className="form-input"
                      placeholder="https://images.unsplash.com/... or similar"
                      value={image}
                      onChange={(e) => {
                        setFormState((prev) => ({ ...prev, image: e.target.value }));
                        setImageFile(null); // Clear file selection if URL is manually typed
                      }}
                      disabled={!!imageFile}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px', width: '100%', marginTop: '12px', fontWeight: 700 }}>
                {currentProduct ? 'Save Inventory Updates' : 'Add Item to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
