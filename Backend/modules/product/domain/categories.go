package domain

import (
	"strings"

	"github.com/google/uuid"
)

type Categories struct {
	id          uuid.UUID
	categoryId  *uuid.UUID
	name        string
	slug        string
	description *string
	imageUrl    *string
	status      Status
	sortOrder   int
}

func NewCategories(id uuid.UUID, categoryId *uuid.UUID, name string, slug string, description *string, imageUrl *string, status Status, sortOrder int) *Categories {
	return &Categories{id: id, categoryId: categoryId, name: name, slug: slug, description: description, imageUrl: imageUrl, status: status, sortOrder: sortOrder}
}

func (c *Categories) Id() uuid.UUID {
	return c.id
}

func (c *Categories) SetId(id uuid.UUID) {
	c.id = id
}

func (c *Categories) CategoryId() *uuid.UUID {
	return c.categoryId
}

func (c *Categories) SetCategoryId(categoryId *uuid.UUID) {
	c.categoryId = categoryId
}

func (c *Categories) Name() string {
	return c.name
}

func (c *Categories) SetName(name string) {
	c.name = name
}

func (c *Categories) Slug() string {
	return c.slug
}

func (c *Categories) SetSlug(slug string) {
	c.slug = slug
}

func (c *Categories) Description() *string {
	return c.description
}

func (c *Categories) SetDescription(description *string) {
	c.description = description
}

func (c *Categories) ImageUrl() *string {
	return c.imageUrl
}

func (c *Categories) SetImageUrl(imageUrl *string) {
	c.imageUrl = imageUrl
}

func (c *Categories) Status() Status {
	return c.status
}

func (c *Categories) SetStatus(status Status) {
	c.status = status
}

func (c *Categories) SortOrder() int {
	return c.sortOrder
}

func (c *Categories) SetSortOrder(sortOrder int) {
	c.sortOrder = sortOrder
}

type Status int

const (
	StatusDraft    Status = iota // 0
	StatusActive                 // 1
	StatusInactive               // 2
)

func (r Status) String() string {
	return [3]string{"draft", "active", "inactive"}[r]
}

func GetStatus(s string) Status {
	switch strings.TrimSpace(strings.ToLower(s)) {
	case "draft":
		return StatusDraft
	case "active":
		return StatusActive
	case "inactive":
		return StatusInactive
	default:
		return StatusDraft
	}
}
