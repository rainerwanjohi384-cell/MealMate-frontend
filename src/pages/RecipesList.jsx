import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Plus, Search, Clock, Trash2 } from "lucide-react";

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const { data } = await api.get("/recipes");
      setRecipes(data);
    } catch (err) {
      console.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Failed to delete recipe");
    }
  };

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900">My Recipes</h1>
        <Link
          to="/recipes/new"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          <Plus size={20} />
          Add Recipe
        </Link>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-6">No recipes found</p>
          <Link
            to="/recipes/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg"
          >
            <Plus size={24} />
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
            >
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock size={16} />
                  <span>{recipe.prep_time || "N/A"} min</span>
                  <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {recipe.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg transition font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
