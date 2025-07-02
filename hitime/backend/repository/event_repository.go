package repository

import (
	"hitime/model"
)

type EventRepository interface {
	Create(event *model.Event) error
	GetByID(id string) (*model.Event, error)
	ListByUser(userID string) ([]*model.Event, error)
	Update(event *model.Event) error
	Delete(id string) error
}

// 可用 GORM 实现 