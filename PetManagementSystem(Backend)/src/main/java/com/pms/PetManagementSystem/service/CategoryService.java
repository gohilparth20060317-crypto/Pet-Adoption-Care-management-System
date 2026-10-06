package com.pms.PetManagementSystem.service;

import com.pms.PetManagementSystem.model.Category;
import com.pms.PetManagementSystem.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	public Category addCategory(Category category) {
		return categoryRepository.save(category);
	}

	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	public Category updateCategory(Long id, Category category) {
		Category existing = categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));
		existing.setName(category.getName());
		existing.setDescription(category.getDescription());
		return categoryRepository.save(existing);
	}

	public void deleteCategory(Long id) {
		categoryRepository.deleteById(id);
	}

}
