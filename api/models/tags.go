package models

import (
	"context"

	"gorm.io/gorm"
)

type TagStore struct {
	db *gorm.DB
}

func NewTagStore(db *gorm.DB) *TagStore {
	return &TagStore{db}
}

func (tagStore *TagStore) Get(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).First(&tag).Error
}

func (tagStore *TagStore) GetAll(ctx context.Context) ([]Tag, error) {
	var tags []Tag
	err := tagStore.db.WithContext(ctx).Find(&tags).Error
	return tags, err
}

func (tagStore *TagStore) Create(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).Create(&tag).Error
}

func (tagStore *TagStore) Patch(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).Save(&tag).Error
}

func (tagStore *TagStore) Delete(ctx context.Context, tag *Tag) error {
	tagStore.Get(ctx, tag)
	return tagStore.db.WithContext(ctx).Delete(&tag).Error
}
