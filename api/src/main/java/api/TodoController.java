package api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;

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
}
