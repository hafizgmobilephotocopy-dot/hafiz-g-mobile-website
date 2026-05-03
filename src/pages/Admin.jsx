import React, { useState, useEffect } from 'react';
import { Users, FileText, Settings, LogOut, Search, Plus, X, CheckCircle, Clock, AlertCircle, Trash2, ShoppingBag, UploadCloud } from 'lucide-react';
import * as OTPAuth from 'otpauth';
import { supabase } from '../lib/supabase';
import './Admin.css';

const PHASES = [
  'Inspection Service',
  'Payment Phase',
  'Verification Phase (Buyer/Seller Bio)',
  'Transferred to Excise',
  'Done'
];

// TOTP Configuration
const ADMIN_TOTP_SECRET = 'JBSWY3DPEHPK3PXP';
const totp = new OTPAuth.TOTP({
  issuer: 'Hafiz G Mobile',
  label: 'Admin',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: ADMIN_TOTP_SECRET
});

const Admin = () => {
  const [session, setSession] = useState(null);
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);
  const [isMfaAuthenticated, setIsMfaAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTab, setActiveTab] = useState('transfers'); // 'transfers' or 'products'
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  // New application form state
  const [newApp, setNewApp] = useState({
    chassis_number: '',
    customer_name: '',
    registration_number: '',
    status: PHASES[0]
  });

  // Products state
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    rating: 5.0,
    tag: ''
  });
  const [productImages, setProductImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && isMfaAuthenticated) {
      if (activeTab === 'transfers') fetchApplications();
      if (activeTab === 'products') fetchProducts();
    }
  }, [session, isMfaAuthenticated, activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicle_transfers')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) console.error('Error fetching applications:', error);
    else setApplications(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching products:', error);
    else setProducts(data);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      setIsEmailAuthenticated(true);
    }
    setLoading(false);
  };

  const handleMfaVerify = (e) => {
    e.preventDefault();
    try {
      const isValid = totp.validate({ token: authCode, window: 1 }) !== null;
      if (isValid) {
        setIsMfaAuthenticated(true);
      } else {
        alert('Invalid Authenticator Code');
      }
    } catch (err) {
      alert('Error verifying code');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsEmailAuthenticated(false);
    setIsMfaAuthenticated(false);
    setAuthCode('');
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('vehicle_transfers')
      .insert([newApp]);

    if (error) {
      alert(error.message);
    } else {
      setShowAddModal(false);
      setNewApp({ chassis_number: '', customer_name: '', registration_number: '', status: PHASES[0] });
      fetchApplications();
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (chassis_number, newStatus) => {
    const { error } = await supabase
      .from('vehicle_transfers')
      .update({ status: newStatus, updated_at: new Date() })
      .eq('chassis_number', chassis_number);

    if (error) {
      alert(error.message);
    } else {
      fetchApplications();
    }
  };

  const handleDeleteTransfer = async (chassis_number) => {
    if (window.confirm(`Are you sure you want to delete application ${chassis_number}?`)) {
      setLoading(true);
      const { error } = await supabase
        .from('vehicle_transfers')
        .delete()
        .eq('chassis_number', chassis_number);

      if (error) {
        alert(error.message);
      } else {
        fetchApplications();
      }
      setLoading(false);
    }
  };

  // ── Cloudinary upload (no Supabase storage used) ──
  const CLOUDINARY_CLOUD = 'dqdsyh4n0';
  const CLOUDINARY_PRESET = 'ml_defaulthafiz';

  const uploadToCloudinary = async (file, index, total) => {
    setUploadProgress(`Uploading image ${index + 1} of ${total}...`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', 'hafiz-g-mobile/products');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setUploadingImages(true);
    setUploadProgress('');

    // Upload images to Cloudinary (free 25 GB CDN)
    const imageUrls = [];
    for (let i = 0; i < productImages.length; i++) {
      try {
        const url = await uploadToCloudinary(productImages[i], i, productImages.length);
        imageUrls.push(url);
      } catch (err) {
        alert('Error uploading image ' + (i + 1) + ': ' + err.message);
      }
    }

    setUploadProgress('Saving product...');
    const { error } = await supabase
      .from('products')
      .insert([{ ...newProduct, images: imageUrls }]);

    if (error) {
      alert(error.message);
    } else {
      setShowAddProductModal(false);
      setNewProduct({ name: '', description: '', price: '', rating: 5.0, tag: '' });
      setProductImages([]);
      setPreviewUrls([]);
      fetchProducts();
    }
    setUploadProgress('');
    setUploadingImages(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) alert(error.message);
      else fetchProducts();
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.chassis_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!session || !isMfaAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card glass">
          <div className="admin-login-header">
            <h2 className="text-gradient">NADRA CMS Admin</h2>
            <p>Authorized Personnel Only</p>
          </div>

          {!session ? (
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Next Step'}
              </button>
            </form>
          ) : !isMfaAuthenticated ? (
            <div className="mfa-section">
                <>
                  <p className="mfa-desc">Enter the 6-digit code from your Authenticator app.</p>
                  <form onSubmit={handleMfaVerify} className="admin-login-form">
                    <div className="input-group">
                      <input 
                        type="text" 
                        placeholder="000000" 
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        maxLength={6}
                        required
                        className="text-center text-2xl tracking-widest"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Verify & Login</button>
                  </form>
                  <button onClick={handleLogout} className="btn-text mt-2 w-full text-center opacity-60">
                    Cancel & Sign Out
                  </button>
                </>
            </div>
          ) : null}
          
          <div className="login-footer">
            <AlertCircle size={14} />
            <span>Two-Factor Authentication Enabled</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container">
      <div className="admin-sidebar glass">
        <div className="admin-brand">
          <h2 className="text-gradient">Hafiz G Admin</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'transfers' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfers')}
          >
            <FileText size={20} /> Transfers
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={20} /> Products
          </button>
          <button className="admin-nav-item"><Users size={20} /> Customers</button>
          <button className="admin-nav-item"><Settings size={20} /> Settings</button>
          <button className="admin-nav-item logout" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>{activeTab === 'transfers' ? 'Vehicle Transfers' : 'Products Management'}</h1>
            <p className="subtitle">
              {activeTab === 'transfers' 
                ? 'Manage and track vehicle registration applications'
                : 'Manage shop products and their image galleries'}
            </p>
          </div>
          <button 
            className="btn btn-secondary flex items-center gap-2" 
            onClick={() => activeTab === 'transfers' ? setShowAddModal(true) : setShowAddProductModal(true)}
          >
            <Plus size={18} /> {activeTab === 'transfers' ? 'New Application' : 'New Product'}
          </button>
        </div>

        <div className="admin-actions-bar glass">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {activeTab === 'transfers' && (
          <div className="admin-table-container glass">
            {loading && <div className="table-loading">Updating...</div>}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Chassis Number</th>
                  <th>Customer Name</th>
                  <th>Current Phase</th>
                  <th>Last Update</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map(app => (
                    <tr key={app.chassis_number}>
                      <td><code className="chassis-code">{app.chassis_number}</code></td>
                      <td>{app.customer_name}</td>
                      <td>
                        <span className={`status-badge phase-${PHASES.indexOf(app.status)}`}>
                          {app.status === 'Done' ? <CheckCircle size={14} /> : <Clock size={14} />}
                          {app.status}
                        </span>
                      </td>
                      <td>{new Date(app.updated_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <select 
                            value={app.status} 
                            onChange={(e) => handleStatusUpdate(app.chassis_number, e.target.value)}
                            className="status-select"
                          >
                            {PHASES.map(phase => (
                              <option key={phase} value={phase}>{phase}</option>
                            ))}
                          </select>
                          <button 
                            className="btn-icon delete-btn" 
                            onClick={() => handleDeleteTransfer(app.chassis_number)}
                            title="Delete Entry"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">No applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-table-container glass">
            {loading && <div className="table-loading">Updating...</div>}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Tag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="table-thumbnail" />
                        ) : (
                          <div className="table-thumbnail placeholder"><ShoppingBag size={16}/></div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.tag ? <span className="product-tag-sm">{product.tag}</span> : '-'}</td>
                      <td>
                        <button 
                          className="btn-icon delete-btn" 
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3>Create New Application</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateApplication} className="add-app-form">
              <div className="input-group">
                <label>Chassis Number (Unique ID)</label>
                <input 
                  type="text" 
                  placeholder="Enter Chassis Number" 
                  value={newApp.chassis_number}
                  onChange={(e) => setNewApp({...newApp, chassis_number: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={newApp.customer_name}
                  onChange={(e) => setNewApp({...newApp, customer_name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Initial Status</label>
                <select 
                  value={newApp.status}
                  onChange={(e) => setNewApp({...newApp, status: e.target.value})}
                >
                  {PHASES.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-text" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3>Create New Product</h3>
              <button className="close-btn" onClick={() => setShowAddProductModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="add-app-form">
              <div className="input-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  placeholder="Enter product name" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  placeholder="Product description" 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>
              <div className="input-group flex gap-4">
                <div style={{flex: 1}}>
                  <label>Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $999" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div style={{flex: 1}}>
                  <label>Tag (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Best Seller" 
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({...newProduct, tag: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Product Images — uploaded to Cloudinary CDN</label>
                <div className="file-upload-wrapper">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setProductImages(files);
                      setPreviewUrls(files.map(f => URL.createObjectURL(f)));
                    }}
                    className="file-input"
                    id="product-images"
                    required
                  />
                  <label htmlFor="product-images" className="file-upload-label">
                    <UploadCloud size={24} />
                    <span>{productImages.length > 0 ? `${productImages.length} image${productImages.length > 1 ? 's' : ''} selected` : 'Click to select images'}</span>
                  </label>
                </div>
                {previewUrls.length > 0 && (
                  <div className="image-previews">
                    {previewUrls.map((url, i) => (
                      <img key={i} src={url} alt={`preview-${i}`} className="preview-thumb" />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-text" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploadingImages}>
                  {uploadingImages ? (uploadProgress || 'Uploading...') : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
