package users

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"github.com/go-playground/validator/v10"
	"infps.drop/internal/types"
	response "infps.drop/internal/utils"
)

func NewStudent() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var newUser types.User

		err := json.NewDecoder(r.Body).Decode(&newUser)

		if errors.Is(err, io.EOF) {
			response.WriteJson(w, http.StatusBadRequest, response.GeneralError(fmt.Errorf("Empty body recieved")))
			return
		}

		if err != nil {
			response.WriteJson(w, http.StatusBadRequest, response.GeneralError(err))
			return
		}

		// validate package
		if err := validator.New().Struct(newUser); err != nil {
			validationErr := err.(validator.ValidationErrors)
			response.WriteJson(w, http.StatusBadRequest, response.ValidationError(validationErr))
			return
		}

		slog.Info("Creating a user")

		w.Write([]byte("Running"))
	}
}
