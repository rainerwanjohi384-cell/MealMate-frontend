import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Upload, X } from "lucide-react";

export default function AddRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [prepTime, setPrepTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit) loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const { data } = await api.get(`/recipes/${id}`);
      setTitle(data.title);
      setIngredients(data.ingredients);
      setInstructions(data.instructions);
      setCategory(data.category);
      setPrepTime(data.prep_time);
      setImageUrl(data.image_url);
      setPreview(data.image_url);
    } catch (err) {
      alert("Recipe not found");
      navigate("/recipes");
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dailydish");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const { secure_url } = await res.json();
      setImageUrl(secure_url);
      setPreview(secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const recipe = { title, ingredients, instructions, category, prep_time: prepTime, image_url: imageUrl };

    try {
      if (isEdit) {
        await api.put(`/recipes/${id}`, recipe);
      } else {
        await api.post("/recipes", recipe);
      }
      navigate("/recipes");
    } catch (err) {
      alert("Failed to save recipe");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center mb-8 gap-4">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-3 rounded-full transition">
          <ArrowLeft size={28} className="text-gray-600" />
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900">{isEdit ? "Edit Recipe" : "New Recipe"}</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <div className="flex items-center gap-4">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-28 h-28 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreview(""); setImageUrl(""); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-400 transition flex-col">
                  <Upload size={28} />
                  <span className="text-xs mt-1">Upload</span>
                </div>
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
              </label>
            )}
            {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>
        </div>

        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
            <option>Dessert</option>
          </select>

          <input
            type="number"
            placeholder="Prep time in minutes"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <textarea
          placeholder="Ingredients (one per line)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <textarea
          placeholder="Step-by-step instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={7}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <div className="flex gap-4 mt-8">
          <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg">
            {isEdit ? "Update Recipe" : "Save Recipe"}
          </button>
          <button type="button" onClick={() => navigate("/recipes")} className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
