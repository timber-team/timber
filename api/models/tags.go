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

func (tagStore *TagStore) Create(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).Create(&tag).Error
}

func (tagStore *TagStore) Get(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).First(&tag).Error
}

func (tagStore *TagStore) GetAll(ctx context.Context) ([]*Tag, error) {
	var tags []*Tag
	err := tagStore.db.WithContext(ctx).Find(&tags).Error
	return tags, err
}

func (tagStore *TagStore) GetByUserID(ctx context.Context, userID uint) ([]*Tag, error) {
	var tags []*Tag
	err := tagStore.db.WithContext(ctx).Where("user_id = ?", userID).Find(&tags).Error
	return tags, err
}

func (tagStore *TagStore) GetByProjectID(ctx context.Context, projectID uint) ([]*Tag, error) {
	var tags []*Tag
	err := tagStore.db.WithContext(ctx).Where("project_id = ?", projectID).Find(&tags).Error
	return tags, err
}

func (tagStore *TagStore) GetByTagName(ctx context.Context, tagName string) ([]*Tag, error) {
	var tags []*Tag
	err := tagStore.db.WithContext(ctx).Where("tag_name = ?", tagName).Find(&tags).Error
	return tags, err
}

func (tagStore *TagStore) Update(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).Save(&tag).Error
}

func (tagStore *TagStore) Delete(ctx context.Context, tag *Tag) error {
	return tagStore.db.WithContext(ctx).Delete(&tag).Error
}
