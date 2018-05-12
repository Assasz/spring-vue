package api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import api.Todo;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Integer> {
    public List<Todo> findAllByOrderByDueDateAsc();

    public List<Todo> findByTitleContainingOrContentContainingOrderByDueDateAsc(String text, String textAgain);
}