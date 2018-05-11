package api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormatSymbols;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Map;
import java.util.Date;

import api.Todo;
import api.TodoRepository;

@RestController
@CrossOrigin(origins = "*")
public class TodoController {

	@Autowired
    private TodoRepository todoRepository;

    @RequestMapping(value = "/todo", method = RequestMethod.GET)
	public Collection<Todo> list() {
		return this.todoRepository.findAllByOrderByDueDateAsc();
	}

	@RequestMapping(value = "/todo/{id}", method = RequestMethod.GET)
	public Todo get(@PathVariable Integer id) {
		return this.todoRepository.getOne(id);
	}

	@RequestMapping(value = "/todo/{id}", method = RequestMethod.PUT)
	public Todo edit(@PathVariable Integer id, @RequestBody Todo body) {
		Todo todo = this.todoRepository.getOne(id);

        todo.setTitle(body.getTitle());
		todo.setContent(body.getContent());
		todo.setDueDate(body.getDueDate());

		return this.todoRepository.save(todo);
	}
}
