package types

type User struct {
	Id       string
	Email    string `validate:"required"`
	Password string `validate:"required"`
	Name     string `validate:"required"`
	Phone    string
}
