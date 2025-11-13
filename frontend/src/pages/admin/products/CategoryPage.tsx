import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentCategory: string | null;
  productCount: number;
}

const mockCategories: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics", parentCategory: null, productCount: 125 },
  { id: 2, name: "Laptops", slug: "laptops", parentCategory: "Electronics", productCount: 45 },
  { id: 3, name: "Smartphones", slug: "smartphones", parentCategory: "Electronics", productCount: 67 },
  { id: 4, name: "Clothing", slug: "clothing", parentCategory: null, productCount: 89 },
  { id: 5, name: "Men's Clothing", slug: "mens-clothing", parentCategory: "Clothing", productCount: 42 },
  { id: 6, name: "Women's Clothing", slug: "womens-clothing", parentCategory: "Clothing", productCount: 47 },
  { id: 7, name: "Books", slug: "books", parentCategory: null, productCount: 156 },
];

export default function CategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("none");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: categoryName, slug, parentCategory: parentCategory === "none" ? null : parentCategory }
          : cat
      );
      setCategories(updatedCategories);
      console.log("Updated category:", { id: editingCategory.id, categoryName, slug, parentCategory });
    } else {
      // Create new category
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: categoryName,
        slug,
        parentCategory: parentCategory === "none" ? null : parentCategory,
        productCount: 0
      };
      setCategories([...categories, newCategory]);
      console.log("Created new category:", newCategory);
    }

    // Reset form
    setCategoryName("");
    setSlug("");
    setParentCategory("none");
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSlug(category.slug);
    setParentCategory(category.parentCategory || "none");
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      console.log("Deleted category:", categoryId);
    }
  };

  const handleCancelEdit = () => {
    setCategoryName("");
    setSlug("");
    setParentCategory("none");
    setEditingCategory(null);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCategoryName(name);
    setSlug(generateSlug(name));
  };

  const getParentCategories = () => {
    return categories.filter(cat => cat.parentCategory === null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: 'Categories', isActive: true }
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage your product categories and organization</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Categories List (60%) */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead>Product Count</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.parentCategory && (
                          <span className="text-muted-foreground mr-2">└─</span>
                        )}
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.slug}
                      </TableCell>
                      <TableCell>
                        {category.parentCategory || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {category.productCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Create New Category Form (40%) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={handleNameChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="category-slug"
                  value={slug}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version of the name. Auto-generated from name.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category</Label>
                <Select value={parentCategory} onValueChange={setParentCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {getParentCategories().map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveCategory} className="flex-1">
                  {editingCategory ? "Update Category" : "Save Category"}
                </Button>
                {editingCategory && (
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
}